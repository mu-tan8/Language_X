<?xml version="1.0"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xhtml="http://www.w3.org/1999/xhtml"
	xmlns="http://mutan8.exout.net/">

<xsl:output method="xml" encoding="UTF-8" media-type="application/xml" omit-xml-declaration="no" />

<xsl:variable name="ns" select="/xhtml:html/xhtml:body/xhtml:div[@id='xml']/xhtml:div[@class='element']/xhtml:span[@class='namespace']" />

<xsl:template name="at">
	<xsl:param name="cur" select="current()" />
	<xsl:for-each select="$cur/xhtml:span[@class='attribute']">
		<xsl:variable name="atPref" select="substring-before(xhtml:span[@class='name'],':')" />
		<xsl:variable name="atURN" select="$ns[xhtml:span[@class='prefix'][text()=$atPref]]/xhtml:span[@class='URN']" />
		<xsl:choose>
			<xsl:when test="$atURN"><xsl:attribute name="{xhtml:span[@class='name']}" namespace="{$atURN}"><xsl:value-of select="xhtml:span[@class='value']" /></xsl:attribute></xsl:when>
			<xsl:otherwise><xsl:attribute name="{xhtml:span[@class='name']}"><xsl:value-of select="xhtml:span[@class='value']" /></xsl:attribute></xsl:otherwise>
		</xsl:choose>
	</xsl:for-each>
</xsl:template>

<xsl:template match="/">
	<xsl:variable name="cur" select="/xhtml:html/xhtml:body/xhtml:div[@id='xml']/xhtml:div[@class='element'][1]" />
	<xsl:variable name="pref" select="substring-before($cur/xhtml:span[@class='name'],':')" />
	<xsl:variable name="urn" select="$ns[xhtml:span[@class='prefix'][text()=$pref]]/xhtml:span[@class='URN']" />
	<xsl:choose>
		<xsl:when test="$urn">
			<xsl:element name="{$cur/xhtml:span[@class='name']}" namespace="{$urn}">
				<xsl:call-template name="at"><xsl:with-param name="cur" select="$cur" /></xsl:call-template>
				<xsl:apply-templates select="$cur/xhtml:div" />
			</xsl:element>
		</xsl:when>
		<xsl:otherwise>
			<xsl:element name="{$cur/xhtml:span[@class='name']}">
				<xsl:call-template name="at"><xsl:with-param name="cur" select="$cur" /></xsl:call-template>
				<xsl:apply-templates select="$cur/xhtml:div" />
			</xsl:element>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="xhtml:div[@class='element']">
	<xsl:variable name="pref" select="substring-before(xhtml:span[@class='name'],':')" />
	<xsl:variable name="urn" select="$ns[xhtml:span[@class='prefix'][text()=$pref]]/xhtml:span[@class='URN']" />
	<xsl:choose>
		<xsl:when test="$urn">
			<xsl:element name="{xhtml:span[@class='name']}" namespace="{$urn}">
				<xsl:call-template name="at"><xsl:with-param name="cur" select="." /></xsl:call-template>
				<xsl:apply-templates select="xhtml:div" />
			</xsl:element>
		</xsl:when>
		<xsl:otherwise>
			<xsl:element name="{xhtml:span[@class='name']}">
				<xsl:call-template name="at"><xsl:with-param name="cur" select="." /></xsl:call-template>
				<xsl:apply-templates select="xhtml:div" />
			</xsl:element>
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="xhtml:div[@class='text']"><xsl:apply-templates select="xhtml:span[@class='value']" /></xsl:template>

<xsl:template match="xhtml:div[@class='comment']">
	<xsl:comment><xsl:value-of select="xhtml:span[@class='value']" /></xsl:comment>
</xsl:template>

<xsl:template match="xhtml:div[@class='processing-instruction']">
	<xsl:processing-instruction name="{xhtml:span[@class='target']}"><xsl:value-of select="xhtml:span[@class='data']" /></xsl:processing-instruction>
</xsl:template>

<xsl:template match="xhtml:span[@class='value']/xhtml:br">&#013;&#010;</xsl:template>

<!--
<xsl:template name="at-CDATA"><xsl:for-each select="span[@class='attribute']"> <xsl:value-of select="span[@class='name']" />="<xsl:value-of select="span[@class='value']" />"</xsl:for-each></xsl:template>

<xsl:template match="div[@class='element']" mode="CDATA">&lt;<xsl:value-of select="span[@class='name']" /><xsl:call-template name="at-CDATA" />&gt;<xsl:apply-templates select="div" mode="CDATA" />&lt;/<xsl:value-of select="span[@class='name']" />&gt;</xsl:template>

<xsl:template match="div[@class='processing-instruction']" mode="CDATA">&lt;?<xsl:value-of select="span[@class='target']"> <xsl:apply-templates select="span[@class='data']" />?&gt;</xsl:template>

<xsl:template match="div[@class='comment']" mode="CDATA">&lt;!<xsl:apply-templates select="span[@class='value']" />&gt;</xsl:template>
-->
</xsl:stylesheet>